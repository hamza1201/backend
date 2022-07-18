const Projet = require("../models/projet");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user");

const createProjet = async (req, res, next) => {
  const { title, content, creator } = req.body;
  const createdProjet = new Projet({
    title,
    content,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating projet failed,please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user", 404);
    return next(error);
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProjet.save({ session: sess });
    user.projets.push(createdProjet);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating projet failed,please try again", 500);
    return next(error);
  }

  res.status(201).json({ projet: createdProjet });
};

const updateProjet = (req, res, next) => {
  Projet.updateOne(
    {
      _id: req.params.id,
    },
    req.body
  ).then((result) => {
    console.log(result);
    res.status(200).json({ message: "updated succeful" });
  });
};

getAllProjets = async (req, res, next) => {
  const projects = await Projet.find();
  res.status(200).json({
    message: "project retreived succesfully!",
    projets: projects,
  });
};

getProjetById = (req, res, next) => {
  Projet.findById(req.params.id).then((projet) => {
    if (projet) {
      res.status(200).json(projet);
    } else {
      res.status(404).json({ message: "Projet not found" });
    }
  });
};

getProjetsByUserId = async (req, res, next) => {
  const userId = req.params.id;
  //let projets;
  let userWithProjets;
  try {
    userWithProjets = await User.findById(userId).populate("projets");
  } catch (err) {
    const error = new HttpError(
      "Fetching projets failed , please try again later",
      500
    );
    return next(error);
  }

  if (!userWithProjets || userWithProjets.length === 0) {
    return next(
      new HttpError("could not find projets for the provided user id", 404)
    );
  }
  res.json({
    projets: userWithProjets.projets.map((projet) =>
      projet.toObject({ getters: true })
    ),
  });
};

deleteProjet = async (req, res, next) => {
  const projetId = req.params.id;
  let projet;

  try {
    projet = await Projet.findById(projetId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "somthing went wrong , could not delete projet",
      500
    );
    return next(error);
  }

  if (!projet) {
    const error = new HttpError("Could not find projet for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await projet.remove({ session: sess });
    projet.creator.projets.pull(projet);
    await projet.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "somthing went wrong , could not delete projet",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Projet deleted!" });
};

exports.getAllProjets = getAllProjets;
exports.getProjetById = getProjetById;
exports.createProjet = createProjet;
exports.updateProjet = updateProjet;
exports.deleteProjet = deleteProjet;
exports.getProjetsByUserId = getProjetsByUserId;

const express = require("express");

const { check } = require("express-validator");

const projetsControllers = require("../controllers/projets-controller");
const router = express.Router();

router
  .post("/", projetsControllers.createProjet)
  .get("/", projetsControllers.getAllProjets);
router
  .put("/:id", projetsControllers.updateProjet)
  .get("/:id", projetsControllers.getProjetById)
  .delete("/:id", projetsControllers.deleteProjet);

router.get("/user/:id", projetsControllers.getProjetsByUserId);

module.exports = router;

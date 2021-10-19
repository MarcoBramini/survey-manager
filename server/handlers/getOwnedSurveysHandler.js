"use strict";

const { query } = require("express-validator");

const dao = require("../dao/dao");

exports.getOwnedSurveysValidationChain = [
  query("limit").optional({ nullable: true }).isInt(),
  query("order")
    .optional({ nullable: true })
    .isIn([
      "+submitsCount",
      "-submitsCount",
      "+createdAt",
      "-createdAt",
      "+publishedAt",
      "-publishedAt",
      "+title",
      "-title",
    ]),
];

exports.getOwnedSurveysHandler = async (req, res) => {
  return await dao
    .getOwnedSurveys(req.user.id, req.query.limit, req.query.order)
    .then((surveys) => res.status(200).json(surveys))
    .catch((err) => {
      console.error(
        "dao.getOwnedSurveys(",
        "\nuserID:",
        req.user.id,
        "\nlimit:",
        req.query.limit,
        "\norder:",
        req.query.order,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};

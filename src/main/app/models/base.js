/**
 * This is base model that must be extened by all models
 */
const knex = require("../commons/knex");
const { Model } = require("objection");
const ChunkQueryBuilder = require("./chunkQueryBuilder");
const date = require("../commons/date");

Model.knex(knex); // pass the knex instance to Objection

class Base extends Model {
  static get QueryBuilder() {
    return ChunkQueryBuilder;
  }

  $beforeInsert() {
    this.createdAt = date.nowString();
    this.updatedAt = date.nowString();
  }

  $beforeUpdate() {
    this.updatedAt = date.nowString();
  }

  get $secureFields() {
    return [];
  }

  $formatJson(json, options) {
    json = super.$formatJson(json, options);
    return _.omit(json, this.$secureFields);
  }
}

module.exports = Base;

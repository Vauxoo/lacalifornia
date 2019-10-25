odoo.define('pos_lock_session.order_cashier', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var DB = require('point_of_sale.DB');

    var QWeb = core.qweb;
    var _t = core._t;

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function (attr, options) {
            _super_order.initialize.call(this, attr, options);
            this.cashier_id = this.pos_cashiers_id || "";
        },
        set_cashier: function (cashier) {
            this.cashier_id = cashier;
            this.trigger('change', this);
        },
        get_cashier: function (cashier) {
            return this.cashier;
        },
        export_as_JSON: function () {
            var json = _super_order.export_as_JSON.call(this);
            json.cashier_id = self.posmodel.user.pos_security_pin;
            return json;
        },
        init_from_JSON: function (json) {
            _super_order.init_from_JSON.apply(this, arguments);
            this.cashier_id = json.cashier_id;
        },
    });

    models.PosModel.prototype.models.push({
        model: 'pos.cashier',
        fields: ['cashier_name', 'cashier_code'],
        loaded: function (self, pos_cashiers) {
            self.pos_cashiers = pos_cashiers;
            self.db.add_pos_cashiers(pos_cashiers);
        },
    });

    DB.include({
        init: function (options) {
            this._super.apply(this, arguments);
            this.pos_cashiers_id = {};
        },
        add_pos_cashiers: function (pos_cashiers) {
            var self = this;
            pos_cashiers.map(function (cashier) {
                self.pos_cashiers_id[cashier.id] = cashier
            });
        },
        get_cashier_by_id: function (id) {
            return this.pos_cashiers_id[id]
        },
        get_cashier_by_code: function (code) {
            var cashiers = self.posmodel.db.pos_cashiers_id;

            var codes = $.map( cashiers, function( value ) {
              return value.cashier_code;
            });

            var id = codes.indexOf(Number(code));
            return this.pos_cashiers_id[id+1];
        }
    });
});

odoo.define('pos_cash_quick_pay.pay', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var DB = require('point_of_sale.DB');
    var screens = require('point_of_sale.screens');

    models.PosModel.prototype.models.push({
        model: 'quick.cash.payment',
        fields: ['display_name', 'name_amt', 'color'],
        loaded: function (self, quick_pays) {
            self.quick_pays = quick_pays;
            self.db.add_quick_payment(quick_pays);
        },
    });

    DB.include({
        init: function (options) {
            this._super.apply(this, arguments);
            this.pay_button_by_id = {};
        },
        add_quick_payment: function (quick_pays) {
            var self = this;
            quick_pays.map(function (pay) {
                self.pay_button_by_id[pay.id] = pay
            });
        },
        get_button_by_id: function (id) {
            return this.pay_button_by_id[id]
        }
    });

    screens.PaymentScreenWidget.include({
        init: function (parent, options) {
            var self = this;
            this._super(parent, options);
            this.div_btns = "";
            var payment_buttons = this.pos.config.payment_buttons;
            if ($("#complete").length > 0) {
                $("#complete").remove();
            }
            this.div_btns += "<div id='complete' class='control-button 1quickpay' data='completo'>COMPLETO</div>"

            for (var i in payment_buttons) {
                var btn_info = this.pos.db.get_button_by_id(payment_buttons[i]);
                this.div_btns +="<div id='" + btn_info.id + "' style='background-color: " + btn_info.color + ";' class='control-button 1quickpay' data='+" + btn_info.display_name +"'>" + parseInt(btn_info.display_name) + "</div>"
            }
        },
        renderElement: function () {
            var self = this;
            this._super();
            this.$('div.1quickpay').click(function () {
                var paymentlines = self.pos.get_order().get_paymentlines();
                var open_paymentline = false;

                for (var i = 0; i < paymentlines.length; i++) {
                    if (! paymentlines[i].paid) {
                    open_paymentline = true;
                    }
                }
                if (! open_paymentline) {
                    self.pos.get_order().add_paymentline(self.pos.cashregisters[0]);
                    self.render_paymentlines();
                }

                var order = self.pos.get_order();
                var price = isNaN($(this).attr('data')) ? self.pos.get_order().get_total_with_tax() : $(this).attr('data');
                self.payment_input(price);
            });
        }
    });
});

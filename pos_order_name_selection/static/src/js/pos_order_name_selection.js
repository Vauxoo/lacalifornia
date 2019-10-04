odoo.define('pos_order_name_selection.order_name', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var chrome = require('point_of_sale.chrome');
    var screens = require('point_of_sale.screens');
    var popups = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');
    var core = require('web.core');

    var QWeb = core.qweb;
    var _t = core._t;

    /*Popup to assign name in pos order*/
    chrome.Chrome.include({
        events: {
            "click .set-order-name": "on_click_set_order_name",
            "click .popup-order-button": "on_click_order_selector"
        },
        renderElement: function () {
            var self = this;
            return this._super();
        },
        on_click_set_order_name: function (e) {
            e.stopPropagation();
            var self = this;
            self.gui.show_popup('order_name', {
                'title': _t('Enter the order name'),
            });
        },
        on_click_order_selector: function (e) {
            e.stopPropagation();
            var self = this;
            self.gui.show_popup('order_selector', {
                'title': _t('Please select an order'),
            });
        }
    });

    var OrderNamePopupWidget = popups.extend({
        template: 'OrderNamePopupWidget',
        init: function (parent) {
            return this._super(parent);
        },
        show: function (options) {
            options = options || {};
            this._super(options);
            this.renderElement();
            if (this.pos.config.iface_vkeyboard && this.chrome.widget.keyboard) {
                this.chrome.widget.keyboard.connect(this.$('input'));
            }
            this.$('input').val(this.pos.get_order().order_name);
            this.$('input').focus();
        },
        click_confirm: function () {
            var value = this.$('input').val();
            this.gui.close_popup();
            this.save_changes();
            if (this.options.confirm) {
                this.options.confirm.call(this, value);
            }
        },
        renderElement: function () {
            this._super();
            var self = this;

            this.$(".confirm-order-name").click(function () {
                self.gui.close_popup();
                self.pos.get_order().set_order_name(self.$('input').val())
            });
        },
    });
    gui.define_popup({name: 'order_name', widget: OrderNamePopupWidget});

    /*  Popup to list orders and selec them  */
    var OrderSelectorPopupWidget = popups.extend({
        template: 'OrderSelectorPopupWidget',
        init: function (parent) {
            return this._super(parent);
        },
        show: function (options) {
            options = options || {};
            this._super(options);
            this.renderElement();
        },
        get_order_by_uid: function (uid) {
            var orders = this.pos.get_order_list();
            for (var i = 0; i < orders.length; i++) {
                if (orders[i].uid === uid) {
                    return orders[i];
                }
            }
            return undefined;
        },
        order_click_handler: function (event, $el) {
            var order = this.get_order_by_uid($el.data('uid'));
            if (order) {
                this.pos.set_order(order);
            }
        },
        renderElement: function () {
            this._super();
            var self = this;

            this.$(".confirm-order-name").click(function () {
                self.gui.close_popup();
                alert(self.pos.get_order().name);
            });

            this.$('div.selection-order').on('click', function (event) {
                self.order_click_handler(event, $(this));
                var order = self.get_order_by_uid($(this).data('uid'));
                var client_name;
                if (order.order_name)
                    client_name = ' ' + order.order_name;
                else
                    client_name = ' Unknown';
                var $order_name = $("<span>", {id: 'selected_order'});

                var $p = $('<p/>')
                var time = moment(order.creation_date).format('hh:mm');
                $p.html(time + ':' + client_name)
                $p.css({
                    'font-weight': '900',
                    'height': '15px',
                    'overflow': 'hidden'
                });
                $order_name.css({
                    'font-size': '16px',
                    'color': 'white',
                    'float': 'left',
                    'margin-top': '-7px',
                    'background': 'black',
                    'display': 'inline-block',
                    'line-height': '24px',
                    'min-width': '24px',
                    'border-radius': '12px'
                })
                self.$('#selected_order').replaceWith($order_name);
                $p.appendTo($('selected_order'));
            });
        },
    });
    gui.define_popup({
        name: 'order_selector',
        widget: OrderSelectorPopupWidget
    });

    /*  Widget to show order in popup  */
    chrome.OrderSelectorWidget.include({
        renderElement: function () {
            var self = this;
            self._super();
            if (self.pos.get_order_list().length > self.pos.config.max_order_shows && self.pos.get_order()) {
                if ($('#order_select').prev().children()[self.pos.config.max_order_shows - 1]) {
                    self.$('#order_select').prev().children().last().css('display', 'none')
                    self.$('#order_select').prev().children().last().removeClass('selected');
                }

                if (!this.$('.order-button.select-order.selected').length) {
                    var order = self.pos.get_order();
                    var client_name;
                    if (order.order_name)
                        client_name = ' ' + order.order_name;
                    else
                        client_name = ' Unknown';
                    var $order_name = $("<span>", {id: 'wk_selected_order'});
                    $order_name.html(order.sequence_number)
                    var $p = $('<p/>')
                    var time = moment(order.creation_date).format('hh:mm');
                    $p.html(time + client_name)
                    $order_name.css({
                        'font-size': '16px',
                        'color': 'white',
                        'float': 'left',
                        'margin-top': '-7px',
                        'background': 'black',
                        'display': 'inline-block',
                        'line-height': '24px',
                        'min-width': '24px',
                        'border-radius': '12px'
                    })
                    self.$('#selected_order').replaceWith($order_name);
                    $p.css({
                        'font-weight': '900',
                        'height': '15px',
                        'overflow': 'hidden'
                    });
                    $p.appendTo($('#order_select center b'));
                    self.$('#order_select').css({
                        'background': '#EEEEEE',
                        'color': 'rgb(75,75,75)'
                    })
                }

                var div_width = self.$('#order_select').width();
                if (!div_width) {
                    self.$('#order_select').prev().children().last().css('display', 'none')
                }

            }
            if (self.pos.get_order_list().length == self.pos.config.max_order_shows && this.$('#order_select')[0]) {
                self.$('#order_select').prev().children().last().css('display', '');
                self.$('#order_select').css('display', 'none');
            }

            self.$('li#order_name').on("mouseover", function () {
                $(this).css('background-color', '#EEEEEE');
                $(this).css('color', 'rgb(75,75,75)');
            });
            self.$('li#order_name').on("mouseout", function () {
                $(this).css('background-color', '');
                $(this).css('color', '');
            });
            self.$('.order-button.select-order').click(function (event) {
                self.order_click_handler(event, $(this));
                if (self.pos.get_order_list()[self.pos.config.max_order_shows - 1])
                    self.$('#selected_order').html(
                        'Select' + ' ' +
                        self.pos.get_order_list()[self.pos.config.max_order_shows - 1].sequence_number + "-" +
                        self.pos.get_order_list().slice(-1).pop().sequence_number)

            });
        },
    });

    /*  Order inheritance for add new order_name field  */
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function (attr, options) {
            _super_order.initialize.call(this, attr, options);
            this.order_name = this.order_name || "";
        },
        set_order_name: function (order_name) {
            this.order_name = order_name;
            this.trigger('change', this);
        },
        get_order_name: function (order_name) {
            return this.order_name;
        },
        export_as_JSON: function () {
            var json = _super_order.export_as_JSON.call(this);
            json.order_name = this.order_name;
            return json;
        },
        init_from_JSON: function (json) {
            _super_order.init_from_JSON.apply(this, arguments);
            this.order_name = json.order_name;
        },
    });
});
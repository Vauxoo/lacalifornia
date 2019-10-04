# -*- coding: utf-8 -*-

from odoo import api, fields, models
from odoo.exceptions import ValidationError

class POSConfig(models.Model):
	_inherit = 'pos.config'

	max_order_shows = fields.Integer(
		string='Maximum Orders Allowed in Order Selector', default=2)

	@api.constrains('max_order_shows')
	def validate_max_order_shows(self):
		if self.max_order_shows < 1:
			raise ValidationError(
				"Maximum orders allowed in Order Selector "
				"must be greater than 0")

class PosOrder(models.Model):
    _inherit = 'pos.order'

    order_name = fields.Char(string='Order name')

    @api.model
    def _process_order(self, pos_order):
        order = super(PosOrder, self)._process_order(pos_order)
        if 'order_name' in pos_order:
            order.order_name = pos_order['order_name']
        return order
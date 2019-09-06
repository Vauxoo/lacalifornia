# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _

class quick_cash_payment(models.Model):
    _name = "quick.cash.payment"
    _description = "Quick cash payment for point of sale"

    name = fields.Float(string='Amount')
    color = fields.Char('Color Index')

    _sql_constraints = [
        ('quick_cash_payment', 'unique(name)',
         'This amount already selected')
    ]

class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_quick_cash_payment = fields.Boolean("Enable Quick Cash Payment")
    validate_on_click = fields.Boolean("Validate On Click")
    cash_method = fields.Many2one('account.journal', "Cash Payment Method")
    payment_buttons = fields.Many2many(
        comodel_name='quick.cash.payment',
        relation='amount_button_name',
        column1='payment_amt_id', column2='pos_config_id')


class AccountJournal(models.Model):
    _inherit = "account.journal"

    @api.model
    def name_search(self, name, args=None, operator='ilike', limit=100):
        if self._context.get('quick_pay'):
            if self._context.get('journal_ids') and \
                    self._context.get('journal_ids')[0] and \
                    self._context.get('journal_ids')[0][2]:
                args += [['id', 'in', self._context.get('journal_ids')[0][2]]]
            else:
                return False

        return super(AccountJournal, self).name_search(
            name, args=args, operator=operator, limit=limit)

{
    'name': 'Quick Cash Payment',
    'category': 'Point of Sale',
    'summary': 'Quick Cash payment buttons for Point of sale',
    'description': """
        Cash payment buttons used to add amount to cash payment lines""",
    'author': 'Vauxoo',
    'license': 'Other proprietary',
    'version': '1.0.1',
    'depends': ['base', 'point_of_sale'],
    'images': ['static/description/main_screenshot.png'],
    "data": [
        'security/ir.model.access.csv',
        'views/point_of_sale.xml',
        'views/pos_template.xml'
    ],
    'qweb': ['static/src/xml/pos.xml'],
    'installable': True,
    'auto_install': False,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
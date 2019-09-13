{
    'name': "POS Session Lock",
    'version': '1.0.1',
    'summary': """The Module Allows the POS User to Set Screen Lock for POS Screen""",
    'description': """This module allows pos user to lock pos screen.""",
    'author': "Vauxoo",
    'category': 'Point of Sale',
    'depends': ['point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/pos_lock.xml',
        'views/pos_templates.xml',
    ],
    'qweb': ['static/src/xml/session_lock.xml'],
    'images': ['static/description/banner.jpg'],
    'installable': True,
    'auto_install': False,
    'application': False,
}

import React from 'react'

const EcomFooter = () => {
  return (
    <div>
          {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black">NIKE</h3>
              <p className="text-gray-400 text-sm">
                Bringing innovation to athletes everywhere.
              </p>
            </div>

            {[
              {
                title: 'Shop',
                links: ['New Releases', 'Men', 'Women', 'Kids', 'Sale'],
              },
              {
                title: 'Help',
                links: [
                  'Order Status',
                  'Shipping',
                  'Returns',
                  'Size Guide',
                  'Contact',
                ],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Sustainability', 'Press', 'Stores'],
              },
            ].map((column, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2026 Nike, Inc. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Guides
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EcomFooter
import Link from 'next/link'

export default function TemplatesPage() {
  // Sample templates data (in a real app, this would come from a database)
  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'A clean, simple layout that puts your content front and center.',
      image: '/images/templates/minimal.png',
      tags: ['Simple', 'Clean', 'Professional'],
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and colorful, perfect for designers and artists.',
      image: '/images/templates/creative.png',
      tags: ['Bold', 'Colorful', 'Creative'],
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Streamlined design with emphasis on skills and code examples.',
      image: '/images/templates/technical.png',
      tags: ['Technical', 'Code-focused', 'Developer'],
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional and polished, ideal for business professionals.',
      image: '/images/templates/corporate.png',
      tags: ['Business', 'Professional', 'Formal'],
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Focused on research, publications, and educational background.',
      image: '/images/templates/academic.png',
      tags: ['Academic', 'Research', 'Education'],
    },
    {
      id: 'freelancer',
      name: 'Freelancer',
      description: 'Highlight services and past client work with clear calls to action.',
      image: '/images/templates/freelancer.png',
      tags: ['Services', 'Clients', 'Freelance'],
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - This would typically be a shared component */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 hidden md:block">
        {/* Sidebar content would be here */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - This would typically be a shared component */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          {/* Header content would be here */}
        </header>

        {/* Main Templates Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Portfolio Templates</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Choose a template that best showcases your work
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white w-full"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-6">
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                  All
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Simple
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Creative
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Technical
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Business
                </button>
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Academic
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 relative">
                    {/* Template preview image would go here */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <span className="font-medium text-lg">{template.name}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {template.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/dashboard/templates/${template.id}/preview`}
                        className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md text-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        Preview
                      </Link>
                      <button className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors">
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Templates Section */}
            <div className="mt-12">
              <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-lg shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:flex-1">
                    <h2 className="text-xl font-bold">Premium Templates</h2>
                    <p className="mt-2">
                      Unlock premium templates with advanced features and more customization options.
                    </p>
                    <button className="mt-4 px-6 py-2 bg-white text-primary-700 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors">
                      Upgrade to Pro
                    </button>
                  </div>
                  <div className="mt-6 md:mt-0 md:flex-1 md:flex md:justify-end">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="w-20 h-20 bg-white/20 rounded"></div>
                      <div className="w-20 h-20 bg-white/20 rounded"></div>
                      <div className="w-20 h-20 bg-white/20 rounded"></div>
                      <div className="w-20 h-20 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/radix-tabs'

export default function EditPortfolioPage() {
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

        {/* Main Editor Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Your Portfolio</h1>
            
            <Tabs defaultValue="personal">
              <TabsList className="w-full flex flex-wrap mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="about">About Me</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              {/* Personal Info Tab */}
              <TabsContent value="personal" className="py-4">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue="Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue="Full Stack Developer"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue="San Francisco, CA"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Profile Image</h2>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        {/* Image placeholder */}
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <button className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Upload Image
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Recommended: Square image, at least 300x300px.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Social Links</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          LinkedIn
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                            linkedin.com/in/
                          </span>
                          <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            defaultValue="johndoe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          GitHub
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                            github.com/
                          </span>
                          <input
                            type="text"
                            id="github"
                            name="github"
                            className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            defaultValue="johndoe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Twitter
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                            twitter.com/
                          </span>
                          <input
                            type="text"
                            id="twitter"
                            name="twitter"
                            className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            defaultValue="johndoe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Personal Website
                        </label>
                        <input
                          type="text"
                          id="website"
                          name="website"
                          className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue="https://johndoe.com"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              {/* About Me Tab (placeholder) */}
              <TabsContent value="about" className="py-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">About Me</h2>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={6}
                      className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      defaultValue="I am a full stack developer with 5+ years of experience building web applications with React, Node.js, and other modern technologies. I'm passionate about creating clean, efficient code and user-friendly interfaces."
                    ></textarea>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Write a professional summary that highlights your expertise, experience, and passion.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Other tabs would have similar structured content */}
              <TabsContent value="projects" className="py-4">
                <p className="text-lg">Projects content would go here</p>
              </TabsContent>
              
              <TabsContent value="skills" className="py-4">
                <p className="text-lg">Skills content would go here</p>
              </TabsContent>
              
              <TabsContent value="experience" className="py-4">
                <p className="text-lg">Experience content would go here</p>
              </TabsContent>
              
              <TabsContent value="education" className="py-4">
                <p className="text-lg">Education content would go here</p>
              </TabsContent>
              
              <TabsContent value="contact" className="py-4">
                <p className="text-lg">Contact content would go here</p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
} 
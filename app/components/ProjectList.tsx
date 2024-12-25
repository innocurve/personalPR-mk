import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { projects } from '@/lib/mockData'

export function ProjectList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


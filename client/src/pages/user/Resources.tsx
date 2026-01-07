import { useState } from 'react';
import { FolderOpen, Search, FileText, Download, Eye, File, FileImage, FileVideo } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const resources = [
  { id: 1, name: 'Employee Handbook 2024', type: 'pdf', size: '2.4 MB', category: 'Documentation', updated: 'Jan 2, 2024' },
  { id: 2, name: 'Q4 Planning Guide', type: 'pdf', size: '1.8 MB', category: 'Planning', updated: 'Dec 28, 2023' },
  { id: 3, name: 'Brand Guidelines', type: 'pdf', size: '5.2 MB', category: 'Design', updated: 'Dec 15, 2023' },
  { id: 4, name: 'Onboarding Checklist', type: 'doc', size: '245 KB', category: 'HR', updated: 'Dec 10, 2023' },
  { id: 5, name: 'Product Demo Video', type: 'video', size: '45 MB', category: 'Training', updated: 'Dec 5, 2023' },
  { id: 6, name: 'Team Photo Album', type: 'image', size: '12 MB', category: 'Media', updated: 'Nov 28, 2023' },
  { id: 7, name: 'Security Training', type: 'pdf', size: '890 KB', category: 'Training', updated: 'Nov 20, 2023' },
  { id: 8, name: 'Expense Policy', type: 'doc', size: '156 KB', category: 'Finance', updated: 'Nov 15, 2023' },
];

const typeIcons = {
  pdf: FileText,
  doc: File,
  video: FileVideo,
  image: FileImage,
};

const typeColors = {
  pdf: 'bg-chart-1/20 text-chart-1',
  doc: 'bg-primary/20 text-primary',
  video: 'bg-chart-4/20 text-chart-4',
  image: 'bg-accent/20 text-accent',
};

export default function UserResources() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Access documents, files, and training materials"
      />

      {/* Search */}
      <div className="relative animate-fade-in">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted/50 border-border"
        />
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource, index) => {
          const Icon = typeIcons[resource.type as keyof typeof typeIcons];
          return (
            <Card
              key={resource.id}
              className="shadow-card animate-fade-in hover:shadow-elegant transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${typeColors[resource.type as keyof typeof typeColors]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{resource.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                      <span className="text-xs text-muted-foreground">{resource.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Updated {resource.updated}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground animate-fade-in">
        Showing {filteredResources.length} of {resources.length} resources
      </div>
    </div>
  );
}

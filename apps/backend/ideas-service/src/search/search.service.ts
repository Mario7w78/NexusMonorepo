import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async indexIdea(idea: any): Promise<any> {
        return this.elasticsearchService.index({
            index: 'ideas',
            body: {
                id: idea._id,
                title: idea.title,
                description: idea.description,
                category: idea.category,
                tags: idea.tags,
                skills: idea.skills,
                status: idea.status,
                visibility: idea.visibility,
                authorId: idea.authorId,
                createdAt: idea.createdAt,
                files: idea.files,
            },
        }) as any;
    }

    async search(text: string): Promise<any[]> {
        const { body } = await this.elasticsearchService.search({
            index: 'ideas',
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['title', 'description', 'tags', 'skills'],
                    },
                },
            },
        } as any) as any;
        const hits = body.hits.hits;
        return hits.map((item: any) => item._source);
    }

    async delete(id: string): Promise<any> {
        return this.elasticsearchService.deleteByQuery({
            index: 'ideas',
            body: {
                query: {
                    match: {
                        id: id,
                    },
                },
            },
        } as any) as any;
    }
}

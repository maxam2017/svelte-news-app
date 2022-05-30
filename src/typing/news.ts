export interface Article {
	id: string;
	title: string;
	thumbnail: string;
	length: number;
	publishedAt: string;
}

type Paragraph =
	| {
			type: 'image';
			value: string;
	  }
	| {
			type: 'text';
			value: string;
	  };

type Author = {
	name: string;
	avatar: string;
};

export interface FullArticle {
	id: string;
	title: string;
	publishedAt: string;
	thumbnails: string[];
	length: number;
	summary: string;
	paragraphs: Paragraph[];
	author: Author;
}

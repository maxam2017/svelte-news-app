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

export interface FullArticle {
	id: string;
	title: string;
	thumbnails: string[];
	length: string;
	summary: string;
	paragraphs: Paragraph[];
}

export interface Article {
	id: string;
	title: string;
	thumbnail: string;
	length: string;
}

export interface FullArticle {
	id: string;
	title: string;
	thumbnails: string[];
	length: string;
	summary: string;
	paragraphs: any[];
}

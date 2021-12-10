import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import algoliaClient from "../../lib/algoliaService";
import { NewsData, NewsCard } from "../../components/NewsCard";

let index = algoliaClient.initIndex("news");

interface Title {
	title: string;
}

interface Organization {
	fields: {
		name: string;
	};
}

interface ItemType {
	name: string;
	topics: Title[];
	objectID: string;
	imageUrl: string;
	description: string;
	organization: Organization[];
	publicationDate: string;
}

const Index: FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const [news, setNews] = useState<NewsData>();
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	useEffect(() => {
		if (id) {
			index
				.search("", {
					filters: `objectID: ${id}`,
				})
				.then(({ hits }) => {
					let item = hits?.[0] as ItemType;
					let data = {
						name: item?.name,
						title: item?.topics?.map((data: any) => data?.title),
						id: item?.objectID,
						imageUrl: item?.imageUrl,
						description: item?.description,
						organization: item?.organization?.map(
							(data: any) => data?.fields?.name
						),
						publicationDate: item?.publicationDate,
					};
					setNews(data);
					setIsLoading(false);
				})
				.catch((error) => {
					setIsError(true);
				});
		}
	}, [id]);

	if (isError) {
		return <div>An error occured while fetching news record for {id}</div>;
	}

	return news?.id && !isLoading ? (
		<div>
			<NewsCard {...news} />
		</div>
	) : !isLoading ? (
		<div>Please enter valid id</div>
	) : null;
};

export default Index;

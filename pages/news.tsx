import React, { useEffect, useState, FC } from "react";
import Image from "next/image";
import client from "../lib/contentfulService";
import algoliaClient from "../lib/algoliaService";
import {
	Typography,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	Button,
	Popover,
	CircularProgress,
} from "@material-ui/core";
import { Search, AccountCircle, ArrowDropDown } from "@material-ui/icons";
import styles from "./news.module.css";
import { NewsData, NewsCard } from "../components/NewsCard";
import { useRouter } from "next/router";
interface LogoItem {
	fields: {
		file: {
			url: string;
		};
	};
}
interface NewsHeaderResponse {
	menuLabel: string;
	searchLabel: string;
	ttile: string;
	logo: LogoItem;
}
interface NewsHeader {
	logo: string;
	menuLabel: string;
	searchLabel: string;
	title: string;
}

interface NewsResponse {
	count: number;
	items: NewsData[];
}

let index = algoliaClient.initIndex("news");

const News: FC = () => {
	const [newsHeader, setNewsHeader] = useState<NewsHeader>();
	const [search, setSearch] = useState<string>("");
	const [displayMenu, setDisplayMenu] = useState(false);
	const [news, setNews] = useState<NewsResponse>();
	const [loading, setLoading] = useState(true);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>("");
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		client
			.getEntries({
				content_type: "newsConfig",
			})
			.then((response) => {
				let data = response?.items?.[0]?.fields as NewsHeaderResponse;
				let newsData = {
					logo: "https:" + data?.logo?.fields?.file?.url,
					menuLabel: data?.menuLabel,
					searchLabel: data?.searchLabel,
					title: data?.ttile,
				};
				setNewsHeader(newsData);
				setLoading(false);
			})
			.catch((err) => setIsError(true));
	}, []);

	useEffect(() => {
		index
			.search(searchValue)
			.then((res) => {
				let data = res?.hits?.map((item: any) => {
					return {
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
				}) as NewsData[];
				setNews({
					count: res?.nbHits,
					items: data,
				});
			})
			.catch((error) => {
				setIsError(true);
			});
	}, [searchValue]);

	if (isError) {
		<div>An Error occured</div>;
	}

	return loading ? (
		<div className={styles.loaderWrapper}>
			<CircularProgress className={styles.spinner} />
		</div>
	) : newsHeader && !loading ? (
		<div className={styles.mainWrapper}>
			<div className={styles.containerLarge}>
				<div className={styles.logo}>
					<Image src={newsHeader.logo} alt="logo" layout="fill" />
				</div>

				<div className={styles.newsWrapper}>
					<Typography variant="h5">{newsHeader.menuLabel}</Typography>
					<div className={styles.userAuth}>
						<AccountCircle />
						<Button
							onClick={(event) =>
								setAnchorEl(event.currentTarget)
							}
						>
							<h2>John Doe</h2>
							<ArrowDropDown />
						</Button>
						<Popover
							open={Boolean(anchorEl)}
							anchorEl={anchorEl}
							onClose={() => setAnchorEl(undefined)}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "center",
							}}
						>
							<Typography className={styles.menuItem}>
								Logout
							</Typography>
						</Popover>
					</div>
				</div>
			</div>
			<div className={styles.lineBottom} />

			<div className={styles.titleWrapper}>
				<Typography variant="h2">{newsHeader.title}</Typography>
			</div>
			<div className={styles.lineBottom} />
			<div className={styles.containerLarge}>
				<div className={styles.searchMainWrapper}>
					<div className={styles.searchFilter}>
						<InputLabel>{newsHeader.searchLabel}</InputLabel>
						<OutlinedInput
							id="search-input"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="search"
							className={styles.inputWrapper}
							endAdornment={
								<InputAdornment position="end">
									<Button
										onClick={() => setSearchValue(search)}
									>
										<Search />
									</Button>
								</InputAdornment>
							}
						/>
					</div>
					<div className={styles.contentImg}>
						<div className={styles.title}>
							{news?.count} Resources Found
						</div>
						{news?.items?.map((item, index) => (
							<div
								onClick={() => router.push(`/news/${item.id}`)}
								key={index}
							>
								<NewsCard {...item} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	) : null;
};

export default News;

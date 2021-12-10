import React, { FC } from "react";
import styles from "./newsCard.module.css";
import dateFormat from "dateformat";

export interface NewsData {
	id: string;
	name: string;
	title: string[];
	imageUrl: string;
	description: string;
	organization: string[];
	publicationDate: string;
}
export const NewsCard: FC<NewsData> = ({
	id,
	name,
	title,
	imageUrl,
	description,
	organization,
	publicationDate,
}) => {
	return (
		<div className={styles.newsCardBlock}>
			<div className={styles.imgWrap}>
				<img src={imageUrl} alt="newsImage" />
			</div>
			<div className={styles.newsContentWrapper}>
				<div>
					<h6>
						{title?.map((item, index) => (
							<div className={styles.contentTitle} key={index}>
								{item}
							</div>
						))}
					</h6>
					<h5>{name}</h5>
				</div>

				<p>{description}</p>
				<div className={styles.dateWrap}>
					<h3>
						{dateFormat(new Date(publicationDate), "mmm dd, yyyy")}
					</h3>
					<span>
						{organization?.map((item, index) => (
							<div key={index}>{item}</div>
						))}
					</span>
				</div>
			</div>
		</div>
	);
};

export default NewsCard;

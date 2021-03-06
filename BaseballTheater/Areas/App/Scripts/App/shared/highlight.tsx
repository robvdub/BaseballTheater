﻿namespace Theater
{
	interface IHighlightProps
	{
		renderDate: boolean;
		highlight: IHighlight | IHighlightSearchResult;
		hideScores: boolean;
	}

	export class Highlight extends React.Component<IHighlightProps, any>
	{
		private get highlight()
		{
			return (this.props.highlight as IHighlightSearchResult).Highlight || (this.props.highlight as IHighlight);
		}

		private get searchResult(): IHighlightSearchResult | null
		{
			const asSearchResult = (this.props.highlight as IHighlightSearchResult);
			const isSearchResult = !!asSearchResult.Highlight;
			return isSearchResult ? asSearchResult : null;
		}

		private renderTitle(displayProps: IHighlightDisplay | null)
		{
			if (!displayProps)
			{
				return <div/>;
			}

			const teamCode = Teams.TeamIdList[parseInt(displayProps.teamId)] || "";
			return (
				<div className={`highlight-title`}>
					<span className={`team`}>{teamCode.toUpperCase()}</span>
					<span className={`title`}>{displayProps.headline}</span>
				</div>);
		}

		private getGameLink()
		{
			const dateString = moment(this.highlight.date).format("YYYYMMDD");
			const gameId = this.searchResult ? String(this.searchResult.GameId) : null
			return gameId ? `/game/${dateString}/${gameId}` : "javascript:void(0)";
		}

		public render()
		{
			const displayProps = HighlightUtility.getDisplayProps(this.highlight, this.props.hideScores, this.searchResult);

			if (!displayProps)
			{
				return <div/>;
			}

			const thumbStyle = {backgroundImage: `url(${displayProps.thumb})`};

			const links = displayProps.links.map((link, i) =>
			{
				return <a href={link.url} target="_blank" key={i}>{link.label}</a>;
			});

			const dateString = moment(this.highlight.date).format("MMM D, YYYY");
			const dateRendered = this.props.renderDate
				? <a className={`date`} href={this.getGameLink()}>
					{dateString} (View game)
				</a>
				: null;

			return (
				<div className={`highlight`}>
					<div className={`video-info`}>
						<a href={displayProps.videoUrl} target={`_blank`}>
							<div className={`thumb`} style={thumbStyle}>

							</div>
							<h2>{this.renderTitle(displayProps)}</h2>
						</a>
					</div>
					{dateRendered}
					<div className={`links`}>
						{links}
					</div>
				</div>
			);
		}
	}
}
import React = require("react");
import {LiveData, PlayerListResponse} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {Col, Row} from "antd";
import {LiveInnings} from "./LiveInnings";
import {ErrorBoundary} from "../../Base/ErrorBoundary";

interface IGameDetailLiveProps
{
	game: LiveData;
	isSpringTraining: boolean;
	gameMedia: GameMedia | null;
}

interface IGameDetailLiveState
{
	players: PlayerListResponse;
}

export class GameDetailLive extends React.Component<IGameDetailLiveProps, IGameDetailLiveState>
{
	constructor(props: IGameDetailLiveProps)
	{
		super(props);

		this.state = {
			players: null
		};
	}

	public async componentWillReceiveProps(nextProps: IGameDetailLiveProps)
	{
		const playerIds = Utility.Mlb.getPlayerIdsFromGame(nextProps.game.gameData);
		LiveGameCreator.getPlayers(playerIds).then(players => {
			this.setState({
				players
			});
		});
	}

	public render()
	{
		const data = this.props.game;
		if (!data)
		{
			return null;
		}

		const currentPlay = this.props.game.liveData.plays.currentPlay;
		if (!currentPlay)
		{
			return null;
		}

		const isSpringTraining = this.props.isSpringTraining;
		const isFinal = Utility.Mlb.gameIsFinal(this.props.game.gameData.status.statusCode);

		const allInningsCols = isFinal ? 24 : 8;

		return <ErrorBoundary>
			<Row gutter={16} type={"flex"}>

				{!isFinal &&
				<Col md={24} lg={16} className={`current-inning`}>
					<LiveInnings
						game={this.props.game}
						isSpringTraining={isSpringTraining}
						showInnings={"current"}
						gameMedia={this.props.gameMedia}/>
				</Col>
				}

				<Col md={24} lg={allInningsCols} className={`all-innings`}>
					<h2>All Innings</h2>
					<LiveInnings
						game={this.props.game}
						isSpringTraining={isSpringTraining}
						showInnings={"all"}
						gameMedia={this.props.gameMedia}/>
				</Col>
			</Row>
		</ErrorBoundary>;
	}
}
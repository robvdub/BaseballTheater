﻿import {Distributor} from "@Utility/Subscribable";
import * as Cookies from "js-cookie";
import {hubConnection} from "signalr-no-jquery";
import {ISettings, SettingsDispatcher} from "../../DataStore/SettingsDispatcher";
import Config from "../Config/config";

export interface ILoadingPayload
{
	isLoading: boolean;
}

export interface IGameUpdateDistributorPayload
{
	gameIds: number[]
}

export class App
{
	public static Instance = new App();

	private static get favoriteTeamFromCookie()
	{
		const cookieFav = Cookies.get("favoriteteam");
		let favArray = [""];
		if (cookieFav)
		{
			try
			{
				favArray = JSON.parse(Cookies.get("favoriteteam"));
				;
			}
			catch (e)
			{
				favArray = [cookieFav];
			}
		}

		return favArray;
	}

	private static getSettingsFromCookie(): ISettings
	{
		let defaultSettings: ISettings ={
			defaultTab: null,
			favoriteTeam: [],
			hideScores: false
		};
		
		const cookie = Cookies.get("settings");
		if (cookie)
		{
			return JSON.parse(cookie) as ISettings;
		}

		return defaultSettings;
	}

	public static setSettingsCookie(settings: Partial<ISettings>)
	{
		const existingSettings = this.getSettingsFromCookie();

		let defaultSettings: ISettings ={
			defaultTab: null,
			favoriteTeam: [],
			hideScores: false
		};
		
		const finalSettings = Object.assign(defaultSettings, existingSettings, settings);

		const expires = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
		Cookies.set("settings", JSON.stringify(finalSettings), {expires});

		App.Instance.settingsDispatcher.update(finalSettings);
		
		return finalSettings;
	}

	public settingsDispatcher = new SettingsDispatcher(App.getSettingsFromCookie());
	public loadingDistributor = new Distributor<ILoadingPayload>();
	public gameUpdateDistributor = new Distributor<IGameUpdateDistributorPayload>();

	private static _isLoadingCount = 0;

	public static get isLoading()
	{
		return this._isLoadingCount > 0;
	}

	public static get isAppMode()
	{
		return false;
		//const queries = LinkHandler.parseQuery();
		//return "app" in queries && queries["app"] === "true";
	}

	public initialize()
	{
	}

	public static startLoading()
	{
		this._isLoadingCount = Math.max(1, this._isLoadingCount + 1);
		App.Instance.loadingDistributor.distribute({
			isLoading: this.isLoading
		});
	}

	public static stopLoading()
	{
		this._isLoadingCount = Math.max(0, this._isLoadingCount - 1);
		App.Instance.loadingDistributor.distribute({
			isLoading: this.isLoading
		});
	}
}

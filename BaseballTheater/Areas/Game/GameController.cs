﻿using System;
using System.Globalization;
using System.Web.Mvc;
using BaseballTheater.Areas.Game.Models;
using MlbDataServer.DataStructures;

namespace BaseballTheater.Areas.Game
{
	public class GameController : Controller
	{
		[OutputCache(Duration = 120)]
		public ActionResult Index(string date, int id)
		{
			var dateTime = DateTime.ParseExact(date, "yyyyMMdd", CultureInfo.InvariantCulture);

			var model = new GameModel(dateTime, id, Request);

			if (model.GameSummary == default(GameSummary))
			{
				return HttpNotFound();
			}

			return View(model);
		}
	}
}

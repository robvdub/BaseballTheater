﻿using System.Xml.Serialization;

namespace MlbDataEngine.Contracts
{
	public class Team
	{
		[XmlText]
		public string Name { get; set; }

		[XmlAttribute("team_id")]
		public string Id { get; set; }

	}
}
import API from "../../../../../fetchData/tba";

export default async function getEventTeams(req, res) {
    const { eventKey } = req.query;

    const teams = await API.EventService.getEventTeamsSimple(eventKey);
    const year = new Date(Date.now()).getFullYear();

    const teamPromises = teams.map(async (team) => {
        const media = await API.TeamService.getTeamMediaByYear(team.key, year);
        const avatar = media.find((m) => m.type === "avatar");
        return {
            ...team,
            avatar,
        };
    });

    const teamsWithAvatars = await Promise.all(teamPromises);

    if (teamsWithAvatars) {
        res.status(200).json(teamsWithAvatars);
    } else {
        res.status(404).json({ error: "Event not found" });
    }
}

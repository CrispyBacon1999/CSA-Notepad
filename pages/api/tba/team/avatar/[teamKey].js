import API from "../../../../../fetchData/tba";

export default async function getEvent(req, res) {
    const { teamKey, year } = req.query;

    const media = await API.TeamService.getTeamMediaByYear(
        teamKey,
        year || new Date(Date.now()).getFullYear()
    );

    const avatar = media.find((m) => m.type === "avatar");

    res.status(200).json(avatar);
}

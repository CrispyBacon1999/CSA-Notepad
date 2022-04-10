import API from "../../../../fetchData/tba";

export default async function getEvent(req, res) {
    const { eventKey } = req.query;

    const event = await API.EventService.getEvent(eventKey);

    if (event) {
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "Event not found" });
    }
}

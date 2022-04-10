import { useRouter } from "next/router";
import React from "react";
import EventSelect from "../components/settings/EventSelect";

export default function Settings() {
    const router = useRouter();
    const [highlighedElements, setHighlightedElements] = React.useState({});

    React.useEffect(() => {
        const hash = router.asPath.split("#");
        console.log(hash);
        const elements =
            hash.length > 1
                ? Object.fromEntries(
                      hash[1].split("&").map((section) => {
                          return [section, true];
                      })
                  )
                : {};
        setHighlightedElements(elements);
        console.log(elements);
    }, [router.asPath]);

    return (
        <div>
            <h1>Settings</h1>
            <EventSelect focused={highlighedElements.event_select === true} />
        </div>
    );
}

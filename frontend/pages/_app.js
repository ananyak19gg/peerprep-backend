import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("campusconnect_user");

        const publicRoutes = ["/", "/login", "/signup"];

        if (!user && !publicRoutes.includes(router.pathname)) {
            router.push("/login");
        }

        setChecked(true);
    }, [router.pathname]);

    if (!checked) return null;

    return <Component {...pageProps} />;
}
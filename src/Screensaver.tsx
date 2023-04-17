import { createRef, useEffect, useRef } from "react";

import './Screensaver.css'

const useAnimationFrame = (callback: () => void) => {
    const requestRef = useRef<number>();
    const animate = () => {
        callback();
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);
};

function rotate_hue_random() {
    let ret=`hue-rotate(${Math.random() * 360}deg)`;
    return ret;
}

export default function Screensaver(props: {
    imgsrc: string,
    width: number,
    speed: number,
    bgcolour: string,
}) {
    const logo = createRef<HTMLImageElement>();
    const bg = createRef<HTMLDivElement>();

    const speed = props.speed ?? 2;

    const x = useRef(0);
    const y = useRef(0);
    const dir_x = useRef(1);
    const dir_y = useRef(1);

    useAnimationFrame(() => {
        if (!logo.current) return;
        if (!bg.current) return;
        const logo_ref = logo.current;
        const screen_height = bg.current.clientHeight - 5; // prevent scrollbars
        const screen_width = bg.current.clientWidth - 5;
        const logo_height = logo_ref.clientWidth;
        const logo_width = logo_ref.clientHeight;

        if (y.current + logo_width >= screen_height || y.current < 0) {
            dir_y.current *= -1;
            logo_ref.style.filter = rotate_hue_random();
        }
        if (x.current + logo_height >= screen_width || x.current < 0) {
            dir_x.current *= -1;
            logo_ref.style.filter = rotate_hue_random();
        }
        x.current += Math.floor(dir_x.current * speed);
        y.current += Math.floor(dir_y.current * speed);
        logo_ref.style.left = x.current + "px";
        logo_ref.style.top = y.current + "px";
    });

    function generate_random_start_position_and_directions(logo_width: number) {
        const screen_height = bg.current!.clientHeight - 5; // prevent scrollbars
        const screen_width = bg.current!.clientWidth - 5;
        const x = Math.random() * (screen_width - logo_width);
        const y = Math.random() * (screen_height - logo_width);
        const dir_x = Math.random() > 0.5 ? 1 : -1;
        const dir_y = Math.random() > 0.5 ? 1 : -1;
        return [x, y, dir_x, dir_y];
    }

    useEffect(() => {
        const [x_pos, y_pos, x_dir, y_dir] = generate_random_start_position_and_directions(props.width ?? 200);
        x.current = x_pos;
        y.current = y_pos;
        dir_x.current = x_dir;
        dir_y.current = y_dir;
    }, []);


    return (
    <div id="bg" ref={bg} style={{
        backgroundColor: props.bgcolour ?? "black"
    }}>
        <img src={props.imgsrc ?? "byy.png"} id="logo" alt="" ref={logo} style={{
            width: props.width ?? 200
        }}  />
    </div>
    )

}
import Image from 'next/image'
import { useState } from 'react';

export default function ImageWithFallback(props) {
    const { src, fallbackSrc, ...rest} = props;
    const [ imgSrc, setImgSrc ] = useState(src)

    return (
        <Image 
            {...rest}
            src={imgSrc}
            onError={() => setImgSrc(fallbackSrc)}
        />
    )
}
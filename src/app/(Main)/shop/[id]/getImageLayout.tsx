import { Box } from "@mui/material";
import React from "react";

const getImageLayout = (
  images: string[],
  onImgClick?: (img: string) => void
) => {
  const count = images.length;
  if (count === 0) return null;
  if (count === 1) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height={320}
      >
        <img
          src={images[0]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            cursor: onImgClick ? "pointer" : undefined,
          }}
          alt="shop"
          onClick={onImgClick ? () => onImgClick(images[0]) : undefined}
        />
      </Box>
    );
  }
  if (count === 2) {
    return (
      <Box display="flex" width="100%" height={320}>
        <img
          src={images[0]}
          style={{
            width: "50%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            cursor: onImgClick ? "pointer" : undefined,
          }}
          alt="shop1"
          onClick={onImgClick ? () => onImgClick(images[0]) : undefined}
        />
        <img
          src={images[1]}
          style={{
            width: "50%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            cursor: onImgClick ? "pointer" : undefined,
          }}
          alt="shop2"
          onClick={onImgClick ? () => onImgClick(images[1]) : undefined}
        />
      </Box>
    );
  }
  if (count === 3) {
    return (
      <Box display="flex" width="100%" height={320}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            style={{
              width: "33.3333%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 0,
              cursor: onImgClick ? "pointer" : undefined,
            }}
            alt={`shop${i}`}
            onClick={onImgClick ? () => onImgClick(img) : undefined}
          />
        ))}
      </Box>
    );
  }
  if (count === 4) {
    return (
      <Box display="flex" width="100%" height={320}>
        <Box display="flex" flexDirection="column" width="50%" height="100%">
          <img
            src={images[0]}
            style={{
              width: "100%",
              height: "50%",
              objectFit: "cover",
              borderRadius: 0,
              cursor: onImgClick ? "pointer" : undefined,
            }}
            alt="shop1"
            onClick={onImgClick ? () => onImgClick(images[0]) : undefined}
          />
          <img
            src={images[1]}
            style={{
              width: "100%",
              height: "50%",
              objectFit: "cover",
              borderRadius: 0,
              cursor: onImgClick ? "pointer" : undefined,
            }}
            alt="shop2"
            onClick={onImgClick ? () => onImgClick(images[1]) : undefined}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%" height="100%">
          <img
            src={images[2]}
            style={{
              width: "100%",
              height: "50%",
              objectFit: "cover",
              borderRadius: 0,
              cursor: onImgClick ? "pointer" : undefined,
            }}
            alt="shop3"
            onClick={onImgClick ? () => onImgClick(images[2]) : undefined}
          />
          <img
            src={images[3]}
            style={{
              width: "100%",
              height: "50%",
              objectFit: "cover",
              borderRadius: 0,
              cursor: onImgClick ? "pointer" : undefined,
            }}
            alt="shop4"
            onClick={onImgClick ? () => onImgClick(images[3]) : undefined}
          />
        </Box>
      </Box>
    );
  }
  if (count >= 5) {
    return (
      <Box display="flex" width="100%" height={320}>
        <img
          src={images[0]}
          style={{
            width: "50%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            cursor: onImgClick ? "pointer" : undefined,
          }}
          alt="shop1"
          onClick={onImgClick ? () => onImgClick(images[0]) : undefined}
        />
        <Box display="flex" flexWrap="wrap" width="50%" height="100%">
          {images.slice(1, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              style={{
                width: "50%",
                height: "50%",
                objectFit: "cover",
                borderRadius: 0,
                cursor: onImgClick ? "pointer" : undefined,
              }}
              alt={`shop${i + 2}`}
              onClick={onImgClick ? () => onImgClick(img) : undefined}
            />
          ))}
        </Box>
      </Box>
    );
  }
};

export default getImageLayout;

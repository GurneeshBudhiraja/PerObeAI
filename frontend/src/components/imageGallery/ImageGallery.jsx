import { useState, useEffect } from "react";
import { Galleria } from "primereact/galleria";

function ImageGallery({ pictures }) {
  const itemTemplate = () => {
    pictures.map((picture, index) => (
      <img
        key={index}
        src={picture.url}
        alt={"Picture " + index}
        style={{ width: "100%", display: "block" }}
      />
    ));
  };

  const thumbnailTemplate = (item) => {
    pictures.map((picture, index) => (
      <img
        key={index}
        src={picture.url}
        alt={"Picture " + index}
        style={{ display: "block" }}
      />
    ));
  };

  return (
    <div>
      <Galleria
        value={pictures}
        numVisible={7}
        circular
        style={{ maxWidth: "800px" }}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
      />
    </div>
  );
}

export default ImageGallery;

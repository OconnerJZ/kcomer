import React from "react";

const MemoriesPhotos = ({ imgs = [] }) => {
  const [img1, img2, img3, img4] = imgs;
  console.log(img4);
  return (
    <div className="card-container">
      {img3 !== undefined && (
        <div
          className="card"
          style={{
            "--image": `url(${img3})`,
            "--angle": "-5deg",
            "--x": "5%",
            "--y": "15%",
            "--caption": "Berlin in 2009",
          }}
        ></div>
      )}

      {img1 !== undefined && (
        <div
          className="card"
          style={{
            "--image": `url(${img1})`,
            "--angle": "-1deg",
            "--x": "-10%",
            "--y": "-20%",
            "--caption": "London, 2001",
          }}
        ></div>
      )}

      {img2 !== undefined && (
        <div
          className="card"
          style={{
            "--image": `url(${img2})`,
            "--angle": "-4deg",
            "--x": "-20%",
            "--y": "5%",
            "--caption": "Los Angeles - 2004",
          }}
        ></div>
      )}
      {img4 !== undefined && (
        <div
          className="card"
          style={{
            "--image": `url(${img4})`,
            "--angle": "7deg",
            "--x": "10%",
            "--y": "-7%",
            "--caption": "Venice, 1999",
          }}
        ></div>
      )}
    </div>
  );
};

export default MemoriesPhotos;

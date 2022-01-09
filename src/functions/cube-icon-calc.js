function cubeIconCalc(d, R, r, z, p) {
  const X30 =
    Math.round((Math.cos(Math.PI / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y30 =
    Math.round((-Math.sin(Math.PI / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const X90 =
    Math.round((Math.cos(Math.PI / 2) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y90 =
    Math.round((-Math.sin(Math.PI / 2) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const X150 =
    Math.round((Math.cos((5 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y150 =
    Math.round((-Math.sin((5 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const X210 =
    Math.round((Math.cos((7 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y210 =
    Math.round((-Math.sin((7 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const X270 =
    Math.round((Math.cos((3 * Math.PI) / 2) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y270 =
    Math.round((-Math.sin((3 * Math.PI) / 2) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const X330 =
    Math.round((Math.cos((11 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const Y330 =
    Math.round((-Math.sin((11 * Math.PI) / 6) * r + z / 2) * Math.pow(10, p)) /
    Math.pow(10, p);
  const bottomXoffset =
    Math.round(Math.sqrt(Math.pow(d, 2) * (3 / 4)) * Math.pow(10, p)) /
    Math.pow(10, p);
  const bottomYoffset = d / 2;
  const center = z / 2;
  const topYoffset = d;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${z} ${z}">
  <circle cx="${z / 2}" cy="${z / 2}" r="${R}" fill="#FF3D00" />
  <polygon points="${X30},${Y30 - topYoffset} ${X90},${
    Y90 - topYoffset
  } ${X150},${Y150 - topYoffset} ${center},${
    center - topYoffset
  }" fill="#6200EA" />
  <polygon points="${X150 - bottomXoffset},${Y150 + bottomYoffset} ${
    X210 - bottomXoffset
  },${Y210 + bottomYoffset} ${X270 - bottomXoffset},${Y270 + bottomYoffset} ${
    center - bottomXoffset
  },${center + bottomYoffset}" fill="#6200EA" />
  <polygon points="${X270 + bottomXoffset},${Y270 + bottomYoffset} ${
    X330 + bottomXoffset
  },${Y330 + bottomYoffset} ${X30 + bottomXoffset},${Y30 + bottomYoffset} ${
    center + bottomXoffset
  },${center + bottomYoffset}" fill="#6200EA" />
</svg>`;
}

console.log(cubeIconCalc(100, 1134, 900, 2520, 3));

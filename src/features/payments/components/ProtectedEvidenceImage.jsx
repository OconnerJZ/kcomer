import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import client from "@Shared/api/http/client";

export default function ProtectedEvidenceImage({ evidence, size = 64, onOpen }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    client.get(evidence.url, { responseType: "blob" }).then((response) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(response.data);
      setSrc(objectUrl);
    }).catch(() => active && setSrc(""));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [evidence.url]);

  return <Box component="button" type="button" onClick={() => src && onOpen?.(src)} aria-label="ampliar comprobante" sx={{ width: size, height: size, p: 0, border: "1px solid", borderColor: "divider", borderRadius: "8px", overflow: "hidden", cursor: src ? "zoom-in" : "default", bgcolor: "grey.100", display: "grid", placeItems: "center" }}>{src ? <Box component="img" src={src} alt="Comprobante protegido" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CircularProgress size={20} />}</Box>;
}

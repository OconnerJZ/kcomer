// Project: Wedding Album - Modular React + MUI
// Directory structure and files concatenated for easy copy-paste.

/* ---------------------------
   File: src/theme/theme.js
   --------------------------- */
import { createTheme } from '@mui/material/styles';

// Combined palettes: Modern (3) + Elegant (1)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2b6ea3' }, // modern blue cold
    secondary: { main: '#845ec2' }, // elegant purple accent
    neutral: { main: '#f7f7fb' },
    background: { default: '#f7f7fb' },
  },
  typography: {
    fontFamily: ['Poppins', 'Inter', 'Helvetica Neue', 'Arial'].join(','),
    h5: { fontWeight: 700 },
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;


/* ---------------------------
   File: src/hooks/useUser.js
   --------------------------- */
import { useEffect, useState } from 'react';

const UID_KEY = 'evento_user_id';
const NAME_KEY = 'evento_user_name';

const generateUID = () => 'u_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-6);

export default function useUser(){
  const [uid, setUid] = useState(() => localStorage.getItem(UID_KEY));
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '');

  useEffect(()=>{
    function onStorage(){
      setUid(localStorage.getItem(UID_KEY));
      setName(localStorage.getItem(NAME_KEY) || '');
    }
    window.addEventListener('storage', onStorage);
    return ()=>window.removeEventListener('storage', onStorage);
  },[]);

  const register = (nameValue) => {
    const id = generateUID();
    localStorage.setItem(UID_KEY, id);
    localStorage.setItem(NAME_KEY, nameValue);
    setUid(id);
    setName(nameValue);
  };

  const clear = ()=>{
    localStorage.removeItem(UID_KEY);
    localStorage.removeItem(NAME_KEY);
    setUid(null);
    setName('');
  }

  return { uid, name, register, clear };
}


/* ---------------------------
   File: src/hooks/useMedia.js
   --------------------------- */
import { useEffect, useState } from 'react';

export default function useMedia(uid){
  const key = uid ? `media_${uid}` : null;
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(()=>{
    if(!key) return;
    try{
      const raw = localStorage.getItem(key);
      if(raw){
        const parsed = JSON.parse(raw);
        setPhotos(parsed.photos || []);
        setVideos(parsed.videos || []);
      }
    }catch(e){}
  },[key]);

  useEffect(()=>{
    if(!key) return;
    try{
      localStorage.setItem(key, JSON.stringify({ photos, videos }));
    }catch(e){}
  },[key, photos, videos]);

  const add = (item)=>{
    if(item.type === 'photo') setPhotos(p=>[item,...p]);
    else setVideos(v=>[item,...v]);
  };
  const remove = (id, type) => {
    if(type === 'photo') setPhotos(p=>p.filter(x=>x.id!==id));
    else setVideos(v=>v.filter(x=>x.id!==id));
  };

  return { photos, videos, add, remove, setPhotos, setVideos };
}


/* ---------------------------
   File: src/components/WelcomeScreen.jsx
   --------------------------- */
import React from 'react';
import { Box, Paper, Typography, TextField, Button, Container } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';

export default function WelcomeScreen({ name, setName, onEnter }){
  return (
    <Container maxWidth="xs" sx={{ mt:6 }}>
      <Paper sx={{ borderRadius:3, overflow:'hidden' }} elevation={6}>
        <Box sx={{ p:4, background: 'linear-gradient(135deg,#d65db1,#845ec2)', color:'white', textAlign:'center' }}>
          <Typography variant="h5">Boda - Ana & Diego</Typography>
          <Typography sx={{ mt:1 }}>Tu mirada hace este momento único.</Typography>
        </Box>

        <Box sx={{ p:3 }}>
          <TextField label="Nombre o apodo" placeholder="Ej: Juanito" fullWidth value={name} onChange={(e)=> setName(e.target.value)} sx={{ mb:2 }} />
          <Button variant="contained" fullWidth startIcon={<CollectionsIcon/>} onClick={onEnter} disabled={!name || name.trim().length===0} sx={{ borderRadius:2, py:1.4 }}>Entrar al álbum</Button>
          <Typography variant="caption" display="block" sx={{ mt:2, color:'text.secondary' }}>Al entrar guardaremos tu sesión localmente para que no vuelvas a poner tu nombre.</Typography>
        </Box>
      </Paper>
    </Container>
  );
}


/* ---------------------------
   File: src/components/DashboardHeader.jsx
   --------------------------- */
import React from 'react';
import { AppBar, Toolbar, Avatar, Box, Typography, Badge, IconButton, Button } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';

export default function DashboardHeader({ name, totalCount, onReset }){
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mt:2 }}>
      <Toolbar>
        <Avatar sx={{ bgcolor: '#845ec2', mr:2 }}>{(name||'T').slice(0,1)}</Avatar>
        <Box sx={{ flexGrow:1 }}>
          <Typography variant="h6">Comparte tus memorias</Typography>
          <Typography variant="caption" sx={{ color:'text.secondary' }}>{name} — bienvenida/o</Typography>
        </Box>

        <Badge badgeContent={totalCount} color="secondary" sx={{ mr:1 }}>
          <IconButton>
            <CollectionsIcon />
          </IconButton>
        </Badge>

        <Button size="small" variant="outlined" onClick={onReset}>Salir</Button>
      </Toolbar>
    </AppBar>
  );
}


/* ---------------------------
   File: src/components/UploadSection.jsx
   --------------------------- */
import React, { useRef } from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';

const MAX_PHOTOS=20, MAX_VIDEOS=3;

export default function UploadSection({ photosCount, videosCount, onPickPhoto, onPickVideo }){
  const fileRef = useRef();
  const videoRef = useRef();

  return (
    <Paper sx={{ p:3, mt:2, borderRadius:3 }} elevation={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Typography sx={{ mb:1, fontWeight:700 }}>Súbelo en 2 clics</Typography>
          <Typography variant="body2" sx={{ color:'text.secondary' }}>Fotos gratuitas hasta {MAX_PHOTOS}. Videos hasta {MAX_VIDEOS} (30s max recomendado).</Typography>

          <Box sx={{ mt:2, display:'flex', gap:1 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={(e)=> onPickPhoto(e)} />
            <input ref={videoRef} type="file" accept="video/*" style={{ display:'none' }} onChange={(e)=> onPickVideo(e)} />

            <Button variant="contained" startIcon={<PhotoCameraIcon/>} onClick={()=> fileRef.current?.click()} sx={{ borderRadius:2 }}>Foto</Button>
            <Button variant="outlined" startIcon={<VideocamIcon/>} onClick={()=> videoRef.current?.click()} sx={{ borderRadius:2 }}>Video</Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} textAlign={{ xs:'left', sm:'right' }}>
          <Chip label={`Fotos: ${photosCount}/${MAX_PHOTOS}`} color="primary" sx={{ mr:1 }} />
          <Chip label={`Videos: ${videosCount}/${MAX_VIDEOS}`} color="secondary" />
        </Grid>
      </Grid>
    </Paper>
  );
}


/* ---------------------------
   File: src/components/Gallery.jsx
   --------------------------- */
import React from 'react';
import { Box, Grid, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Gallery({ photos, videos, onDelete }){
  return (
    <Box sx={{ mt:3 }}>
      <Typography sx={{ mb:1, fontWeight:700 }}>Tus aportes</Typography>
      <Grid container spacing={2}>
        {photos.length === 0 && videos.length === 0 && (
          <Grid item xs={12}><Paper sx={{ p:3, textAlign:'center', borderRadius:2 }}><Typography>Aún no has subido fotos o videos.</Typography><Typography variant="caption" sx={{ color:'text.secondary' }}>Captura algo increíble y súbelo.</Typography></Paper></Grid>
        )}

        {videos.map(v=> (
          <Grid item xs={6} sm={3} key={v.id}>
            <Paper sx={{ overflow:'hidden', position:'relative', borderRadius:2 }}>
              <video src={v.src} style={{ width:'100%', height:140, objectFit:'cover' }} controls />
              <IconButton size="small" sx={{ position:'absolute', top:6, right:6, bgcolor:'rgba(255,255,255,0.85)' }} onClick={()=> onDelete(v.id,'video')}><DeleteIcon fontSize="small"/></IconButton>
            </Paper>
          </Grid>
        ))}

        {photos.map(p=> (
          <Grid item xs={6} sm={3} key={p.id}>
            <Paper sx={{ overflow:'hidden', position:'relative', borderRadius:2 }}>
              <img src={p.src} alt="" style={{ width:'100%', height:140, objectFit:'cover' }} />
              <IconButton size="small" sx={{ position:'absolute', top:6, right:6, bgcolor:'rgba(255,255,255,0.85)' }} onClick={()=> onDelete(p.id,'photo')}><DeleteIcon fontSize="small"/></IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


/* ---------------------------
   File: src/components/PreviewDialog.jsx
   --------------------------- */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function PreviewDialog({ open, file, isVideo, note, setNote, onClose, onConfirm }){
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Vista previa</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign:'center' }}>
          {file && isVideo ? <video src={file.src} controls style={{ width:'100%', borderRadius:8 }} /> : file && <img src={file.src} alt="preview" style={{ width:'100%', borderRadius:8 }} />}
        </Box>
        <TextField label="Agregar nota (opcional)" fullWidth multiline rows={2} sx={{ mt:2 }} value={note} onChange={(e)=> setNote(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" startIcon={<CheckCircleOutlineIcon/>} onClick={onConfirm}>Subir</Button>
      </DialogActions>
    </Dialog>
  );
}


/* ---------------------------
   File: src/App.jsx
   --------------------------- */
import React, { useState, useRef } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import theme from './theme/theme';
import useUser from './hooks/useUser';
import useMedia from './hooks/useMedia';
import WelcomeScreen from './components/WelcomeScreen';
import DashboardHeader from './components/DashboardHeader';
import UploadSection from './components/UploadSection';
import Gallery from './components/Gallery';
import PreviewDialog from './components/PreviewDialog';

const generateUID = () => 'm_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-5);

export default function App(){
  const { uid, name, register, clear } = useUser();
  const [localName, setLocalName] = useState(name || '');
  const { photos, videos, add, remove } = useMedia(uid);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const fileRef = useRef();
  const videoRef = useRef();

  const onEnter = () => {
    register(localName.trim());
  };

  const readFileAsDataURL = (file) => new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.onerror=rej; fr.readAsDataURL(file); });

  const onPickFile = async (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const src = await readFileAsDataURL(f);
    setPreviewFile({ id: generateUID(), src, file:f });
    setPreviewIsVideo(false);
    setNoteDraft('');
    setPreviewOpen(true);
    e.target.value = null;
  };
  const onPickVideo = async (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const src = await readFileAsDataURL(f);
    setPreviewFile({ id: generateUID(), src, file:f });
    setPreviewIsVideo(true);
    setNoteDraft('');
    setPreviewOpen(true);
    e.target.value = null;
  };

  const onConfirmUpload = () => {
    if(!previewFile) return;
    const item = { id: previewFile.id, src: previewFile.src, note: noteDraft, createdAt: new Date().toISOString(), type: previewIsVideo ? 'video' : 'photo' };
    add(item);
    setPreviewOpen(false);
    setPreviewFile(null);
    setNoteDraft('');
  };

  const onDelete = (id, type) => {
    remove(id, type);
  };

  const onReset = ()=>{
    if(window.confirm('¿Borrar tu sesión local? (solo demo)')){
      clear();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight:'100vh', bgcolor: theme.palette.background.default, pb:6 }}>
        {!uid ? (
          <WelcomeScreen name={localName} setName={setLocalName} onEnter={onEnter} />
        ) : (
          <Container maxWidth="md" sx={{ mt:4 }}>
            <DashboardHeader name={name} totalCount={photos.length + videos.length} onReset={onReset} />
            <UploadSection photosCount={photos.length} videosCount={videos.length} onPickPhoto={onPickFile} onPickVideo={onPickVideo} />
            <Gallery photos={photos} videos={videos} onDelete={onDelete} />
          </Container>
        )}

        <PreviewDialog open={previewOpen} file={previewFile} isVideo={previewIsVideo} note={noteDraft} setNote={setNoteDraft} onClose={()=> setPreviewOpen(false)} onConfirm={onConfirmUpload} />
      </Box>
    </ThemeProvider>
  );
}


/* ---------------------------
   File: src/index.js
   --------------------------- */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if(container){
  const root = createRoot(container);
  root.render(<App />);
}


/* ---------------------------
   END
   --------------------------- */

// src/components/card/CardPlace.jsx
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { StyledCard } from "./CardPlaceStyled";
import useCardPlace from "@Hooks/components/useCardPlace";
import {
  CardPlaceLocation,
  CardPlaceMenu,
  CardPlacePhotos,
  CardPlaceReviews,
} from "./CardPlaceMovements";
import CardPlaceFront from "./CardPlaceFront";
import { Collapse, Box, Stack, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Chip } from "@mui/material";
import {
  ThumbUp,
  DeliveryDining,
  AccessTime,
  Close
} from "@mui/icons-material";
import PropTypes from 'prop-types';
import { useState } from 'react';

const TitlePlace = ({ text = "Tacos el pariente" }) => {
  return (
    <Typography
      className="titlePrimary"
      sx={{ fontWeight: 900, fontSize: "23px" }}
      level="title-sm"
    >
      {text}
    </Typography>
  );
};

TitlePlace.propTypes = {
  text: PropTypes.string
};

const CardPlace = ({ data, loadBusinessMenu }) => {
  const { flipped, movement, expanded, onMovement, expandCard } = useCardPlace({ data, loadBusinessMenu });
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Horarios de ejemplo - reemplazar con data.schedule
  const scheduleData = [
    { day: 'Lunes', open: '09:00', close: '22:00' },
    { day: 'Martes', open: '09:00', close: '22:00' },
    { day: 'Miércoles', open: '09:00', close: '22:00' },
    { day: 'Jueves', open: '09:00', close: '22:00' },
    { day: 'Viernes', open: '09:00', close: '23:00' },
    { day: 'Sábado', open: '10:00', close: '23:00' },
    { day: 'Domingo', open: '10:00', close: '21:00' }
  ];

  const pathMedia = "http://localhost:3000/uploads/"

  return (
    <>
      <StyledCard sx={{ width: 340, borderRadius: "20px", position: 'relative' }} elevation={7}>
        <CardHeader
          onClick={expandCard}
          avatar={
            <Avatar
              className="card-avatar"
              sx={{
                width: 110,
                height: 110,
                border: data?.isOpen 
                  ? "2px solid rgba(13, 158, 61, 1)" 
                  : "2px solid rgb(255,64,59)",
                borderStyle: "dashed",
                padding: "2px",
                cursor: 'pointer'
              }}
              aria-label="recipe"
              src={pathMedia+data?.urlImage}
            >
              {data?.title?.charAt(0) || 'T'}
            </Avatar>
          }
          title={<TitlePlace text={data?.title} />}
          subheader={
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ThumbUp sx={{ fontSize: "23px", color: "#efb810" }} />
                <Typography variant="body2">{data?.likes || 3}</Typography>
                {data?.hasDelivery && (
                  <DeliveryDining sx={{ fontSize: "27px" }} />
                )}
              </Stack>
            </Box>
          }
          sx={{
            padding: expanded
              ? "16px 16px 0px 16px"
              : { xs: "16px 16px 16px 16px", sm: "16px 16px 0px 16px" },
            textAlign: "center",
            cursor: 'pointer'
          }}
        />
        
        {/* Botón de Horario */}
        <IconButton
          color="default"
          aria-label="ver horarios"
          onClick={(e) => {
            e.stopPropagation();
            setScheduleOpen(true);
          }}
          sx={{
            fontSize: "18px",
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s'
          }}
        >
          <AccessTime />
        </IconButton>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardPlaceFront flipped={flipped} onMovement={onMovement} data={data} />
          
          {movement === "location" && (
            <CardPlaceLocation flipped={flipped} onMovement={onMovement} />
          )}
          
          {movement === "photo" && (
            <CardPlacePhotos flipped={flipped} onMovement={onMovement} />
          )}
          
          {movement === "menu" && (
            <CardPlaceMenu 
              flipped={flipped} 
              onMovement={onMovement}
              businessId={data.id}
              businessName={data.title}
              menu={data.menu || []}
            />
          )}
          
          {movement === "review" && (
            <CardPlaceReviews flipped={flipped} onMovement={onMovement} />
          )}
        </Collapse>
      </StyledCard>

      {/* Dialog de Horarios */}
      <Dialog 
        open={scheduleOpen} 
        onClose={() => setScheduleOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {data?.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Horarios de atención
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setScheduleOpen(false)}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Chip 
              label={data?.isOpen ? '🟢 Abierto Ahora' : '🔴 Cerrado'}
              color={data?.isOpen ? 'success' : 'error'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <List dense sx={{ bgcolor: 'background.paper' }}>
            {scheduleData.map((schedule, index) => (
              <ListItem 
                key={schedule.day}
                sx={{ 
                  borderBottom: index < scheduleData.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  py: 1.5,
                  px: 2
                }}
              >
                <ListItemText
                  primary={schedule.day}
                  secondary={`${schedule.open} - ${schedule.close}`}
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.85rem',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 2,
              fontStyle: 'italic'
            }}
          >
            ⏰ Los horarios pueden variar en días festivos
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

CardPlace.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    urlImage: PropTypes.string,
    isOpen: PropTypes.bool,
    likes: PropTypes.number,
    hasDelivery: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.object),
    schedule: PropTypes.object
  }).isRequired,
};

export default CardPlace;
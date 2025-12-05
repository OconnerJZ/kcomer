// src/components/card/CardMenuList.jsx
import { useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { 
  Stack, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  TextField 
} from '@mui/material';
import { Add, Remove, NoteAdd } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CardMenuList = ({ item, businessId, businessName, onAddToCart }) => {
  const [quantity, setQuantity] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const [hasNote, setHasNote] = useState(false);

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateCart(newQty, note);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      
      // Si llega a 0, eliminar completamente
      if (newQty === 0) {
        setNote('');
        setHasNote(false);
      }
      
      updateCart(newQty, newQty === 0 ? '' : note);
    }
  };

  const updateCart = (qty, itemNote) => {
    onAddToCart({
      itemId: item.id,
      businessId,
      businessName,
      item: {
        ...item,
        quantity: qty,
        note: itemNote || ''
      }
    });
  };

  const handleSaveNote = () => {
    setHasNote(note.trim() !== '');
    updateCart(quantity, note);
    setNoteDialogOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          width: '100%',
          padding: '5px 2px',
          alignItems: 'center',
          mb: 0.5,
          '&:hover': {
            boxShadow: 'md',
            borderColor: 'neutral.outlinedHoverBorder',
          },
        }}
      >
        <AspectRatio
          ratio="1"
          sx={{
            width: 90,
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
        >
          <img
            src={item.image}
            srcSet={item.image}
            loading="lazy"
            alt={item.name}
          />
        </AspectRatio>

        <CardContent sx={{ flex: 1 }}>
          <Typography level="title-md" id="card-description">
            {item.name}
          </Typography>
          <Typography
            sx={{ fontSize: '11px', mb: '3px' }}
            aria-describedby="card-description"
          >
            {item.description}
          </Typography>

          {/* Mostrar nota si existe */}
          {hasNote && note && (
            <Chip
              size="sm"
              variant="soft"
              color="warning"
              sx={{ mt: 0.5, fontSize: '10px' }}
            >
              📝 {note.length > 20 ? note.substring(0, 20) + '...' : note}
            </Chip>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip
              variant="outlined"
              color="success"
              size="sm"
              sx={{
                pointerEvents: 'none',
                minHeight: '0px',
                height: '23px',
                fontSize: '13px',
              }}
              startDecorator="$"
            >
              {item.price.toFixed(2)}
            </Chip>

            {/* Botón de Nota */}
            {quantity > 0 && (
              <IconButton
                size="small"
                color={hasNote ? "warning" : "default"}
                onClick={() => setNoteDialogOpen(true)}
                sx={{ 
                  border: '1px solid',
                  borderColor: hasNote ? 'warning.main' : 'divider'
                }}
              >
                <NoteAdd fontSize="small" />
              </IconButton>
            )}

            {/* Stepper */}
            <Stack 
              direction="row" 
              alignItems="center"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <IconButton
                size="small"
                onClick={handleDecrement}
                disabled={quantity === 0}
              >
                <Remove fontSize="small" />
              </IconButton>

              <Typography
                sx={{ 
                  fontWeight: 600, 
                  minWidth: 20, 
                  textAlign: 'center',
                  mx: 0.5
                }}
              >
                {quantity}
              </Typography>

              <IconButton
                size="small"
                onClick={handleIncrement}
                color="primary"
              >
                <Add fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog para agregar nota */}
      <Dialog 
        open={noteDialogOpen} 
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Agregar nota especial</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.name}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="Ej: Sin cebolla, sin crema, extra salsa..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${note.length}/100 caracteres`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveNote}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CardMenuList.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  businessName: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default CardMenuList;
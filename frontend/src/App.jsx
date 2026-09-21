import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const conversionOptions = [
  { value: 'feetToMeters', label: 'Pieds → mètres' },
  { value: 'metersToFeet', label: 'Mètres → pieds' },
  { value: 'litersToGallons', label: 'Litres → gallons US' },
  { value: 'gallonsToLiters', label: 'Gallons US → litres' },
  { value: 'celsiusToFahrenheit', label: 'Degrés Celsius → Fahrenheit' },
  { value: 'fahrenheitToCelsius', label: 'Degrés Fahrenheit → Celsius' },
];

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 6,
  }).format(value);
}

export default function App() {
  const [value, setValue] = useState('');
  const [conversionType, setConversionType] = useState('feetToMeters');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (value.trim() === '' || !Number.isFinite(Number(value))) {
      setError('Veuillez saisir une valeur numérique valide.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: conversionType, value: Number(value) }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'La conversion a échoué.');
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Impossible de joindre le serveur. Vérifiez que le backend est démarré.'
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={5} sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                Convertisseur d’unités
              </Typography>
              <Typography color="text.secondary">
                Longueurs, volumes et températures, en quelques secondes.
              </Typography>
            </Box>

            <Stack component="form" spacing={3} onSubmit={handleSubmit} noValidate>
              <TextField
                label="Valeur à convertir"
                type="number"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                inputProps={{ step: 'any' }}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="conversion-label">Type de conversion</InputLabel>
                <Select
                  labelId="conversion-label"
                  value={conversionType}
                  label="Type de conversion"
                  onChange={(event) => setConversionType(event.target.value)}
                >
                  {conversionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SwapHorizIcon />}
                disabled={loading}
              >
                {loading ? 'Conversion…' : 'Convertir'}
              </Button>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            {result && (
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.50' }}>
                <Typography color="text.secondary" gutterBottom>
                  {formatNumber(result.input)} {result.from} =
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {formatNumber(result.result)} {result.to}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

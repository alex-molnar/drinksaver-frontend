import React from 'react';
import { Card, CardActionArea, Typography, Box, CircularProgress } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import WineBarIcon from '@mui/icons-material/WineBar';
import LiquorIcon from '@mui/icons-material/Liquor';
import AddIcon from '@mui/icons-material/Add';

interface RecommendationButtonProps {
  name: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  isAddButton?: boolean;
}

// Simple icon selection based on drink name keywords
const getDrinkIcon = (name: string, isAddButton: boolean) => {
  if (isAddButton) return <AddIcon sx={{ fontSize: 32 }} />;
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes('beer') || lowerName.includes('lager') || lowerName.includes('ale')) {
    return <SportsBarIcon sx={{ fontSize: 32 }} />;
  }
  if (lowerName.includes('wine') || lowerName.includes('champagne') || lowerName.includes('prosecco')) {
    return <WineBarIcon sx={{ fontSize: 32 }} />;
  }
  if (lowerName.includes('whiskey') || lowerName.includes('vodka') || lowerName.includes('gin') || lowerName.includes('rum')) {
    return <LiquorIcon sx={{ fontSize: 32 }} />;
  }
  return <LocalBarIcon sx={{ fontSize: 32 }} />;
};

const RecommendationButton: React.FC<RecommendationButtonProps> = ({
  name,
  onClick,
  loading = false,
  disabled = false,
  isAddButton = false,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 100,
        bgcolor: isAddButton ? 'grey.100' : 'background.paper',
        border: isAddButton ? '2px dashed' : 'none',
        borderColor: 'grey.300',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: disabled ? 'none' : 'translateY(-2px)',
          boxShadow: disabled ? undefined : 4,
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        disabled={disabled || loading}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          gap: 1,
        }}
      >
        {loading ? (
          <CircularProgress size={32} color="primary" />
        ) : (
          <Box
            sx={{
              color: isAddButton ? 'text.secondary' : 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getDrinkIcon(name, isAddButton)}
          </Box>
        )}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            wordBreak: 'break-word',
            lineHeight: 1.3,
            color: isAddButton ? 'text.secondary' : 'text.primary',
          }}
        >
          {loading ? 'Saving...' : name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default RecommendationButton;

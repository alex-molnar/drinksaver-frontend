import React from 'react';
import { Button, Typography, Box } from '@mui/material';

interface RecommendationButtonProps {
  name: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const RecommendationButton: React.FC<RecommendationButtonProps> = ({
  name,
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        textTransform: 'none',
        p: 1.5,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontWeight: 600,
            wordBreak: 'break-word',
            lineHeight: 1.3,
            fontSize: '1.1rem',
          }}
        >
          {name}
        </Typography>
      </Box>
    </Button>
  );
};

export default RecommendationButton;

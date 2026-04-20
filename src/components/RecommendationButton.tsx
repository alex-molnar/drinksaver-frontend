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
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        textTransform: 'none',
        p: 1,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            wordBreak: 'break-word',
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
      </Box>
    </Button>
  );
};

export default RecommendationButton;

import { Delete, DeleteOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export default function DeleteButton() {
  return (
    <Box sx={{position: 'relative'}}>
      <Button  
         sx={{
            opacity: 0.8,
            transition: 'opacity 0.3s',
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
               opacity: 0.7,
               backgroundColor: 'rgba(178, 127, 133, 0.4)',
            }
         }}
      >
         <DeleteOutline 
            sx={{
               fontSize: 32,
               color: 'red',
               position: 'absolute',
            }}
         />
         <Delete 
            sx={{
               fontSize: 28,
               color: 'red',
            }}
         />
      </Button>
    </Box>
  )
}
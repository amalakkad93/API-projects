import { Box } from "@mui/material";

const DotIndicator = ({ total, current }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "8px",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: current === i ? "white" : "rgba(0, 0, 0, 0.5)",
            margin: "0 2px",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.8)"
          }}
        />
      ))}
    </Box>
  );
};

export default DotIndicator;

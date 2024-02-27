import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import ListItemContent from "@mui/joy/ListItemContent";
import useCardPlaceAccordion from "@Hooks/components/useCardPlaceAccordion";

const CardPlaceAccordion = ({ data: datacard }) => {
  const { data } = useCardPlaceAccordion({ datacard: datacard });
  return (
    <AccordionGroup
      size="sm"
      variant="plain"
      transition="0.2s"
      sx={{
        width: "100%",
        maxWidth: 340,
        borderRadius: "md",
        [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
          {
            paddingBlock: "5px",
          },
        [`& .${accordionSummaryClasses.button}`]: {
          paddingBlock: "6px",
        },
      }}
    >
      {data.map((item) => (
        <Accordion key={item.label}>
          <AccordionSummary>
            <Avatar color={item.color} size="md">
              {item.icon}
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">{item.label}</Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "1px 5px" }}>
            {item.details}
          </AccordionDetails>
        </Accordion>
      ))}
    </AccordionGroup>
  );
};

export default CardPlaceAccordion;

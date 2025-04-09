import { Link } from "expo-router";
import { Pressable, View, Text, Image } from "react-native";
import { StyleSheet, Animated } from "react-native";
import { useRef } from "react";

type Event = {
  _id: string;
  username: string;
  examTitle: string;
  registrationDate: string;
  preparationLink: string;
  books: string[];
  category: string;
  examType: string;
  examApplicationLink: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  event: Event;
};

export default function EventListItem({ event }: Props) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link href={`/${event._id}`} asChild>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 1.05 : 1 }],
          },
        ]}
      >
        <Animated.View
          style={[styles.eventContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.imageWrapper}>
            {/* Ensure the event image is displayed */}
            <Image
              source={{ uri: `${event.image}` }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.examTitle}</Text>
            <Text style={styles.eventDescription}>{event.preparationLink}</Text>
          </View>
          <View style={styles.eventFooter}>
            <Text style={styles.eventUpdated}>{event.category}</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    position: "relative",
    flexDirection: "column",
    marginVertical: 8, // Reduced vertical margin
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // Slightly smaller border radius
    boxShadow: "0px 10px 36px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
    alignSelf: "center",
    width: "85%", // Decreased width further
  },
  imageWrapper: {
    width: "100%", // Ensure image wrapper takes full width of the container
    height: 150,  // Fixed height for the image container
    overflow: "hidden",
  },
  eventImage: {
    width: "100%", // Ensure image covers the full width of the wrapper
    height: "100%", // Ensure image takes full height of the wrapper
  },
  eventContent: {
    padding: 16, // Reduced padding for the content
  },
  eventTitle: {
    marginBottom: 12, // Reduced margin for the title
    fontFamily: "Bebas Neue",
    fontSize: 20, // Slightly smaller font size
    letterSpacing: 0.06,
    color: "#000",
  },
  eventDescription: {
    color: "#64748b",
    lineHeight: 20, // Reduced line height
    fontWeight: "400",
  },
  eventFooter: {
    marginHorizontal: 12,
    borderTopColor: "#F9C0AB",
    borderTopWidth: 1,
    paddingVertical: 6, // Reduced padding for footer
    paddingHorizontal: 4,
  },
  eventUpdated: {
    fontSize: 12, // Reduced font size for the category
    color: "#F9C0AB",
    fontWeight: "500",
  },
});

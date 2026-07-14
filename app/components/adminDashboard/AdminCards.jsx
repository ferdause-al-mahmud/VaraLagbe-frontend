import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors, styles } from "./adminTheme";

function avatarFor(name, image) {
  if (image) return image;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "VL")}&background=006878&color=fff`;
}

export function QueueItem({ avatar, name, detail }) {
  return (
    <TouchableOpacity style={styles.queueItem} activeOpacity={0.75}>
      <Image source={{ uri: avatarFor(name, avatar) }} style={styles.queueAvatar} />
      <View style={styles.queueText}>
        <Text style={styles.queueName}>{name}</Text>
        <Text style={styles.queueDetail}>{detail}</Text>
      </View>
      <Ionicons name="chevron-forward" size={19} color={colors.tealDark} />
    </TouchableOpacity>
  );
}

export function ListingCard({ listing, onAction }) {
  const isFlagged = listing.status === "FLAGGED";
  const isLive = listing.status === "LIVE";
  const isPending = listing.status === "PENDING REVIEW";

  return (
    <View style={styles.listingCard}>
      <View style={styles.listingTop}>
        <Image source={{ uri: avatarFor(listing.title, listing.image) }} style={styles.listingImage} />
        <View style={styles.listingBody}>
          <View
            style={[
              styles.statusBadge,
              isLive && styles.statusLive,
              isPending && styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isLive && styles.statusTextLive,
                isPending && styles.statusTextPending,
              ]}
            >
              {listing.status}
            </Text>
          </View>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {listing.title}
          </Text>
          <Text style={styles.listingOwner}>Owner: {listing.owner}</Text>
          <Text
            style={[styles.listingNote, isLive && styles.listingNoteLive]}
            numberOfLines={1}
          >
            {listing.note}
          </Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={17} color="#2d3a3d" />
      </View>

      <View style={styles.actionRow}>
        {isFlagged && (
          <ActionButton
            label="Remove"
            icon="trash-outline"
            tone="danger"
            flex={1.05}
            onPress={() => onAction?.(listing.id, "remove")}
          />
        )}
        {isPending && (
          <ActionButton
            label="Approve Listing"
            icon="checkmark-circle-outline"
            tone="primary"
            flex={2.3}
            onPress={() => onAction?.(listing.id, "approve")}
          />
        )}
        {!isPending && (
          <ActionButton
            label="Edit"
            icon="pencil-outline"
            tone="neutral"
            flex={1}
            onPress={() => onAction?.(listing.id, isLive ? "flag" : "approve")}
          />
        )}
        {isLive && (
          <ActionButton
            label="Flag"
            icon="flag-outline"
            tone="neutral"
            flex={1}
            onPress={() => onAction?.(listing.id, "flag")}
          />
        )}
        {!isLive && (
          <TouchableOpacity
            style={[
              styles.iconAction,
              isFlagged ? styles.iconActionPrimary : styles.iconActionNeutral,
            ]}
            activeOpacity={0.75}
            onPress={() => onAction?.(listing.id, isFlagged ? "approve" : "approve")}
          >
            <Ionicons
              name={isFlagged ? "checkmark-circle" : "eye-outline"}
              size={17}
              color={isFlagged ? "#fff" : colors.tealDark}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function UserCard({ user, onAction }) {
  const verified = user.status === "VERIFIED";

  return (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <Image source={{ uri: avatarFor(user.name, user.avatar) }} style={styles.userAvatar} />
        <View style={styles.userTitleWrap}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userRoleRow}>
            <Text style={styles.userRole}>{user.role}</Text>
            <View
              style={[
                styles.userStatusDot,
                verified ? styles.verifiedDot : styles.pendingDot,
              ]}
            />
            <Text
              style={[
                styles.userStatus,
                verified ? styles.verifiedText : styles.pendingText,
              ]}
            >
              {user.status}
            </Text>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" size={19} color="#2d3a3d" />
      </View>

      <View style={styles.nidRow}>
        <View>
          <Text style={styles.nidTitle}>{user.metaTitle}</Text>
          {!!user.metaSubtitle && (
            <Text style={styles.nidSubtitle}>{user.metaSubtitle}</Text>
          )}
        </View>
        {user.metaText ? (
          <View style={styles.viewNid}>
            <Ionicons name="eye-outline" size={15} color={colors.tealDark} />
            <Text style={styles.viewNidText}>{user.metaText}</Text>
          </View>
        ) : (
          <Ionicons name="checkmark-circle" size={17} color={colors.greenText} />
        )}
      </View>

      {verified ? (
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.75}>
          <Text style={styles.profileButtonText}>View Profile Details</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.rejectButton}
            activeOpacity={0.75}
            onPress={() => onAction?.(user.id, "reject")}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            activeOpacity={0.75}
            onPress={() => onAction?.(user.id, "approve")}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function ActionButton({ label, icon, tone, flex = 1, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        tone === "danger" && styles.actionDanger,
        tone === "primary" && styles.actionPrimary,
        tone === "neutral" && styles.actionNeutral,
        { flex },
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={14}
        color={
          tone === "primary"
            ? "#fff"
            : tone === "danger"
              ? colors.redText
              : colors.tealDark
        }
      />
      <Text
        style={[
          styles.actionText,
          tone === "primary" && styles.actionTextPrimary,
          tone === "danger" && styles.actionTextDanger,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

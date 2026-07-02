namespace ScribeCount.Email.Api.DTOs;

public record SubscriberProfileDto(
    string Id, string Name, string Email, string Status,
    List<string> Tags, decimal OpenRate, string JoinedAt, string? ListId);

public record ProfileListItemDto(string Id, string Name, string Color);

public record ProfileSegmentItemDto(string Id, string Name, string RuleLabel);

public record ProfileChannelDto(
    bool EmailCampaignsSubscribed,
    bool TransactionalSubscribed,
    bool EmailCampaignsBlocklisted);

public record ProfileCampaignStatsDto(
    int Sent, int Delivered, int DeliveredPercent,
    int UniqueOpens, int UniqueOpenPercent,
    int UniqueClicks, int UniqueClickPercent);

public record ProfileActivityDto(
    string Id, string ActivityType, string Title, string Description,
    string? CampaignId, string? CampaignSubject, string? CampaignFrom,
    string Status, string OccurredAt, string RelativeTime);

public record SubscriberProfileDetailDto(
    string Id, string FirstName, string LastName, string Email, string Status,
    List<string> Tags, decimal OpenRate, decimal ClickRate, string JoinedAt, string Note,
    ProfileChannelDto Channels, ProfileCampaignStatsDto CampaignStats,
    List<ProfileListItemDto> Lists, int TotalLists,
    List<ProfileSegmentItemDto> Segments,
    List<ProfileActivityDto> Activities);

public record CreateSubscriberRequest(
    string Name, string Email, string Status, List<string>? Tags, decimal? OpenRate, Guid? ListId,
    List<string>? ListIds, string? Note);

public record UpdateSubscriberRequest(
    string? Name, string? Email, string? Status, List<string>? Tags,
    decimal? OpenRate, decimal? ClickRate, string? Note, List<string>? ListIds);

public record AudienceListDto(
    string Id, string Name, string Description, int Count, string Color, string OptIn,
    string Created, string Updated, string? FolderId, string? FolderName);

public record CreateAudienceListRequest(
    string Name, string Description, string Color, string OptInMethod, Guid? FolderId);

public record AudienceSegmentCardDto(
    string Id, string Name, string Description, int Count, string Color,
    string RuleType, string RuleLabel, string? FolderId, string? FolderName,
    string Created, string Updated, bool IsDynamic);

public record CreateAudienceSegmentRequest(
    string Name, string Description, string Color, string RuleType,
    Guid? FolderId, string? RuleConfigJson);

public record AudienceFolderDto(string Id, string Name, string Kind, int ItemCount);

public record ListsSegmentsOverviewDto(
    int TotalSubscribers, int ActiveSubscribers, int TotalLists, int TotalSegments, string Channel);

public record SegmentTemplateDto(
    string Key, string Name, string Description, string RuleType, string Category);

public record ListsSegmentsBundleDto(
    ListsSegmentsOverviewDto Overview,
    List<AudienceFolderDto> ListFolders,
    List<AudienceFolderDto> SegmentFolders,
    List<AudienceListDto> Lists,
    List<AudienceSegmentCardDto> Segments,
    List<SegmentTemplateDto> SegmentTemplates);

public record CreateAudienceFolderRequest(string Name, string Kind);

public record GrowthToolDto(
    string Key, string Name, string Description, string Action, string Tooltip,
    string Category, string IconKey, string? ConfigJson);

public record GrowthToolsBundleDto(List<GrowthToolDto> Tools);

public record SaveGrowthToolConfigRequest(string ConfigJson);

public record EmailTemplateDto(
    string Id, string Name, string Category, string Preview, string Description,
    string SubjectLine, string PreviewText, string HtmlBody, string IconKey, string SuggestedCampaignType,
    bool IsCustom);

public record ContentBlockDto(
    string Id, string Name, string Type, string Description, int UsedIn, string IconKey, string HtmlBody);

public record BrandColorDto(string Label, string Value);

public record BrandAssetDto(string Id, string Name, string Size, string IconKey, string? Url, string? MimeType);

public record ContentBundleDto(
    List<EmailTemplateDto> Templates,
    List<ContentBlockDto> Blocks,
    List<BrandColorDto> BrandColors,
    List<BrandAssetDto> Assets,
    List<WebsiteTemplateDto> WebsiteTemplates);

public record WebsiteTemplateDto(
    string Id, string Name, string Category, string PreviewCode, string Description, string HtmlBody, string IconKey,
    string TemplateKind, string? FormType, string? ThemeGradient, string SuggestedName,
    string Headline, string BodyDescription, string ButtonText, string ThankYouMessage, string DefaultStatus);

public record CreateContentBlockRequest(
    string Name, string BlockType, string Description, string IconKey);

public record UpdateContentBlockRequest(
    string? Name, string? BlockType, string? Description, string? IconKey, string? HtmlBody);

public record CreateCustomTemplateRequest(
    string Name, string? Description, string? SubjectLine);

public record UpdateEmailTemplateRequest(
    string? Name, string? Description, string? SubjectLine, string? HtmlBody);

public record AppendBlockToTemplateRequest(bool? InsertAtStart);

public record UpdateBrandColorsRequest(List<BrandColorDto> Colors);

public record CreateBrandAssetRequest(string Name, string FileType, long SizeBytes, string IconKey);

public record SignUpFormDto(
    string Id, string Name, string Type, string Status, int Submissions,
    decimal ConversionRate, string TargetList, string? TargetListId, string LastModified, string IconKey,
    string Headline, string Description, string ButtonText, string ThankYouMessage);

public record SignUpFormStatsDto(string Label, string Value, double Change);

public record LandingPageDto(
    string Id, string Name, string Status, string Slug, string Url, int Visits, int Signups,
    double ConvRate, string ThemeGradient, string IconKey,
    string Headline, string Description, string ButtonText, string ThankYouMessage);

public record WebsiteBundleDto(
    List<SignUpFormStatsDto> Stats,
    List<SignUpFormDto> Forms,
    List<LandingPageDto> LandingPages,
    List<AudienceListDto> Lists);

public record CreateSignUpFormRequest(
    string Name, string FormType, string Status, Guid? TargetListId, string? TargetListName,
    string? Headline, string? Description, string? ButtonText, string? ThankYouMessage);

public record UpdateSignUpFormRequest(
    string Name, string FormType, string Status, Guid? TargetListId, string? TargetListName,
    string? Headline, string? Description, string? ButtonText, string? ThankYouMessage);

public record CreateLandingPageRequest(
    string Name, string Status, string ThemeGradient, string IconKey,
    string? Headline, string? Description, string? ButtonText, string? ThankYouMessage);

public record UpdateLandingPageRequest(
    string Name, string Status, string ThemeGradient, string IconKey, string? Slug,
    string? Headline, string? Description, string? ButtonText, string? ThankYouMessage);

public record PublicFormPreviewDto(
    string Id, string Name, string FormType, string Status,
    string Headline, string Description, string ButtonText, string ThankYouMessage);

public record PublicLandingPageDto(
    string Id, string Name, string Slug, string Status, string ThemeGradient, string IconKey,
    string Headline, string Description, string ButtonText, string ThankYouMessage);

public record PublicFormSubmitRequest(string Email, string? FirstName);

public record PublicFormSubmitResult(string Message, bool Success);
